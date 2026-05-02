package service;

import dto.RegisterRequest;
import dto.UserResponse;
import jakarta.validation.Valid;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    public @Nullable UserResponse registerUser(@Valid RegisterRequest request) {
    }
}
