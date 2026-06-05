package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {

    private final GeminiService geminiService;
    private final RecommendationRepository recommendationRepository;

    public Recommendation generateRecommendation(Activity activity) {
        String prompt = createPromptForActivity(activity);
        String aiResponse = geminiService.getAnswer(prompt);
        log.info("AI Response: {}", aiResponse);
        return processAiResponse(activity, aiResponse);
    }

    private Recommendation processAiResponse(Activity activity, String aiResponse) {
        try {
            String cleaned = aiResponse
                    .replaceAll("(?s)```json\\s*", "")
                    .replaceAll("```", "")
                    .trim();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(cleaned);

            JsonNode analysisNode = root.path("analysis");
            StringBuilder fullAnalysis = new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall: ");
            addAnalysisSection(fullAnalysis, analysisNode, "intensity", "Intensity: ");
            addAnalysisSection(fullAnalysis, analysisNode, "endurance", "Endurance: ");
            addAnalysisSection(fullAnalysis, analysisNode, "calorieEfficiency", "Calorie Efficiency: ");
            addAnalysisSection(fullAnalysis, analysisNode, "recovery", "Recovery: ");

            List<String> improvements = extractImprovements(root.path("improvements"));
            List<String> suggestions = extractSuggestions(root.path("suggestions"));
            List<String> safety = extractSafety(root.path("safety"));

            Recommendation recommendation = Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safety)
                    .createdAt(LocalDateTime.now())
                    .build();

            Recommendation saved = recommendationRepository.save(recommendation);
            log.info("Saved recommendation with id: {}", saved.getId());
            return saved;

        } catch (Exception e) {
            log.error("Failed to parse AI response: {}", e.getMessage());
            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation("Unable to generate recommendation at this time.")
                    .improvements(Collections.singletonList("No improvements available."))
                    .suggestions(Collections.singletonList("No suggestions available."))
                    .safety(Collections.singletonList("No safety tips available."))
                    .createdAt(LocalDateTime.now())
                    .build();
        }
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode,
                                    String key, String prefix) {
        if (!analysisNode.path(key).isMissingNode()) {
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();
        if (improvementsNode.isArray()) {
            improvementsNode.forEach(item -> {
                String area = item.path("area").asText();
                String detail = item.path("recommendation").asText();
                improvements.add(String.format("%s: %s", area, detail));
            });
        }
        return improvements.isEmpty()
                ? Collections.singletonList("No specific improvements identified.")
                : improvements;
    }

    private List<String> extractSuggestions(JsonNode suggestionNode) {
        List<String> suggestions = new ArrayList<>();
        if (suggestionNode.isArray()) {
            suggestionNode.forEach(item -> {
                String type = item.path("type").asText();
                String description = item.path("description").asText();
                suggestions.add(String.format("%s: %s", type, description));
            });
        }
        return suggestions.isEmpty()
                ? Collections.singletonList("No specific suggestions identified.")
                : suggestions;
    }

    private List<String> extractSafety(JsonNode safetyNode) {
        List<String> safetyList = new ArrayList<>();
        if (safetyNode.isArray()) {
            safetyNode.forEach(item -> {
                String risk = item.path("risk").asText();
                String advice = item.path("advice").asText();
                safetyList.add(String.format("%s: %s", risk, advice));
            });
        }
        return safetyList.isEmpty()
                ? Collections.singletonList("No specific safety risks identified.")
                : safetyList;
    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
                You are an expert AI fitness coach and performance analyst.
                
                Analyze the following fitness activity and generate a detailed fitness report.
                
                Activity Details:
                {
                  "type": "%s",
                  "duration": %d,
                  "caloriesBurned": %d,
                  "additionalMetrics": "%s"
                }
                
                IMPORTANT RULES:
                - Respond ONLY with valid JSON
                - No markdown, no code blocks, no explanations outside JSON
                
                Response Format:
                {
                  "analysis": {
                    "overall": "Detailed overall performance analysis",
                    "intensity": "Low / Moderate / High with explanation",
                    "endurance": "Endurance evaluation",
                    "calorieEfficiency": "Calorie burn analysis",
                    "recovery": "Recovery analysis"
                  },
                  "improvements": [
                    { "area": "Specific area", "recommendation": "Detailed recommendation" }
                  ],
                  "suggestions": [
                    { "type": "Workout", "description": "Workout suggestion" },
                    { "type": "Recovery", "description": "Recovery suggestion" },
                    { "type": "Nutrition", "description": "Nutrition suggestion" }
                  ],
                  "safety": [
                    { "risk": "Possible risk", "advice": "Safety recommendation" }
                  ]
                }
                """,
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned(),
                activity.getAdditionalMetrics()
        );
    }
}