package com.fitness.gateway;

import com.fitness.gateway.user.RegisterRequest;
import com.fitness.gateway.user.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@Slf4j
@RequiredArgsConstructor
public class KeycloakUserSyncFilter implements WebFilter {

    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");

        // ✅ Guard: skip filter entirely if no token present
        if (token == null || !token.startsWith("Bearer ")) {
            return chain.filter(exchange);
        }

        RegisterRequest registerRequest = getUserDetails(token);

        // ✅ Guard: skip if JWT parsing failed
        if (registerRequest == null || registerRequest.getKeycloakId() == null) {
            log.warn("Could not extract user details from token, skipping sync.");
            return chain.filter(exchange);
        }

        String keycloakId = registerRequest.getKeycloakId();

        return userService.validateUser(keycloakId)
                .flatMap(exists -> {
                    if (!exists) {
                        log.info("User not found, registering: {}", keycloakId);
                        return userService.registerUser(registerRequest)
                                .doOnSuccess(result -> log.info("User registered successfully: {}", keycloakId))
                                .doOnError(e -> log.error("Failed to register user {}: {}", keycloakId, e.getMessage()))
                                .onErrorResume(e -> Mono.just(false)); // ✅ don't let registration failure block the request
                    } else {
                        log.info("User already exists, skipping sync: {}", keycloakId);
                        return Mono.just(true);
                    }
                })
                .then(Mono.defer(() -> {
                    // ✅ Always add X-User-ID header and continue, regardless of sync result
                    ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                            .header("X-User-ID", keycloakId)
                            .build();
                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                }));
    }

    private RegisterRequest getUserDetails(String token) {
        try {
            String tokenWithoutBearer = token.replace("Bearer ", "").trim();
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            RegisterRequest registerRequest = new RegisterRequest();
            registerRequest.setEmail(claims.getStringClaim("email"));
            registerRequest.setKeycloakId(claims.getStringClaim("sub"));
            registerRequest.setPassword("dummy@123123");
            registerRequest.setFirstName(claims.getStringClaim("given_name"));
            registerRequest.setLastName(claims.getStringClaim("family_name"));

            return registerRequest;

        } catch (Exception e) {
            log.error("Failed to parse JWT token: {}", e.getMessage());
            return null; // ✅ caller now checks for null before using
        }
    }
}