# Backend Controller Updates Required

## Updated ActivityController.java

Add the following endpoint to your `ActivityController` class to support searching activities by name:

```java
package com.fitness.activityservice.controller;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.service.ActivityService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@AllArgsConstructor
public class ActivityController {

    private ActivityService activityService;

    @PostMapping
    public ResponseEntity trackActivity(
            @RequestBody ActivityRequest request,
            @RequestHeader("X-User-ID") String userId) {
        request.setUserId(userId);  // inject userId from header into request
        return ResponseEntity.ok(activityService.trackActivity(request));
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getUserActivities(
            @RequestHeader("X-User-ID") String userId) {
        return ResponseEntity.ok(activityService.getUserActivities(userId));
    }

    @GetMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> getActivityById(
            @PathVariable String activityId) {
        return ResponseEntity.ok(activityService.getActivityById(activityId));
    }

    // NEW: Search activities by name or activity type
    @GetMapping("/search")
    public ResponseEntity<List<ActivityResponse>> searchActivities(
            @RequestParam String name,
            @RequestHeader("X-User-ID") String userId) {
        return ResponseEntity.ok(activityService.searchActivitiesByName(name, userId));
    }

    // NEW: Search activities by activity type
    @GetMapping("/type/{activityType}")
    public ResponseEntity<List<ActivityResponse>> getActivitiesByType(
            @PathVariable String activityType,
            @RequestHeader("X-User-ID") String userId) {
        return ResponseEntity.ok(activityService.getActivitiesByType(activityType, userId));
    }
}
```

## ActivityService Updates Required

Add these methods to your `ActivityService`:

```java
public List<ActivityResponse> searchActivitiesByName(String name, String userId) {
    // Search activities by name (partial match, case-insensitive)
    return activityRepository.findByUserIdAndNameContainingIgnoreCase(userId, name)
        .stream()
        .map(this::convertToResponse)
        .collect(Collectors.toList());
}

public List<ActivityResponse> getActivitiesByType(String activityType, String userId) {
    // Get all activities of a specific type for the user
    return activityRepository.findByUserIdAndActivityTypeIgnoreCase(userId, activityType)
        .stream()
        .map(this::convertToResponse)
        .collect(Collectors.toList());
}
```

## ActivityRepository Updates Required

Add these query methods to your `ActivityRepository`:

```java
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ActivityRepository extends MongoRepository<Activity, String> {
    List<Activity> findByUserId(String userId);
    
    // NEW: Search by name
    List<Activity> findByUserIdAndNameContainingIgnoreCase(String userId, String name);
    
    // NEW: Filter by activity type
    List<Activity> findByUserIdAndActivityTypeIgnoreCase(String userId, String activityType);
}
```

## Frontend Features Implemented

✅ Activities displayed in a responsive 2-column grid layout  
✅ AI recommendations loaded for each activity card  
✅ Activity stats (duration, calories, kcal/min) shown on each card  
✅ Search by name endpoint ready  
✅ Filter by activity type endpoint ready  

## Testing the New Features

1. **Grid Layout**: Activities now display side-by-side in 2 columns
2. **AI Recommendations**: Each card shows the AI recommendation preview
3. **Search by Name**: Call `GET /api/activities/search?name=running`
4. **Filter by Type**: Call `GET /api/activities/type/RUNNING`
