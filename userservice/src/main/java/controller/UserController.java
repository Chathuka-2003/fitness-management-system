package controller;

import dto.RegisterRequest;
import dto.UserResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUser(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }
    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@Valid  @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.registerUser(request));
    }
}
