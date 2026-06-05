package com.fitness.gateway.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final WebClient userServiceWebClient;

    public Mono<Boolean> validateUser(String userId) {
        log.info("Calling User Validation API for userId: {}", userId);
        return userServiceWebClient.get()
                .uri("/api/users/{userId}/validate", userId)
                .retrieve()
                .bodyToMono(Boolean.class)
                .onErrorResume(WebClientResponseException.class, e -> {
                    if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                        log.warn("User not found in user-service: {}", userId);
                        return Mono.just(false); // ✅ return false, not an error
                    }
                    log.error("Error validating user {}: {} {}", userId, e.getStatusCode(), e.getMessage());
                    return Mono.just(false); // ✅ fail safe — treat all errors as "not found"
                })
                .onErrorResume(e -> {
                    log.error("Unexpected error validating user {}: {}", userId, e.getMessage());
                    return Mono.just(false); // ✅ catches non-WebClient errors (connection refused, etc.)
                });
    }

    public Mono<Boolean> registerUser(RegisterRequest registerRequest) {
        log.info("Calling User Registration API for email: {}", registerRequest.getEmail());
        return userServiceWebClient.post()
                .uri("/api/users/register")
                .bodyValue(registerRequest)
                .retrieve()
                .bodyToMono(UserResponse.class) // ✅ matches what user-service actually returns
                .map(response -> response != null)
                .onErrorResume(WebClientResponseException.class, e -> {
                    log.error("Error registering user {}: {} {}", registerRequest.getEmail(), e.getStatusCode(), e.getMessage());
                    return Mono.just(false);
                })
                .onErrorResume(e -> {
                    log.error("Unexpected error registering user {}: {}", registerRequest.getEmail(), e.getMessage());
                    return Mono.just(false);
                });
    }
}