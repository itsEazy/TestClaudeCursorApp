package com.example.testclaudecursor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/auth")
public class AuthController {
    
    @Value("${supabase.url}")
    private String supabaseUrl;
    
    @Value("${supabase.key}")
    private String supabaseKey;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("apikey", supabaseKey);
            headers.set("Authorization", "Bearer " + supabaseKey);
            headers.set("Content-Type", "application/json");
            
            String url = supabaseUrl + "/rest/v1/users?username=eq." + request.getUsername() + "&select=*";
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            
            ObjectMapper mapper = new ObjectMapper();
            JsonNode responseNode = mapper.readTree(response.getBody());
            
            if (responseNode.isArray() && responseNode.size() > 0) {
                JsonNode userNode = responseNode.get(0);
                String storedPassword = userNode.get("password").asText();
                
                if (storedPassword.equals(request.getPassword())) {
                    return ResponseEntity.ok(new LoginResponse(true, "Login successful", userNode.get("username").asText()));
                } else {
                    return ResponseEntity.ok(new LoginResponse(false, "Invalid password", null));
                }
            } else {
                return ResponseEntity.ok(new LoginResponse(false, "User not found", null));
            }
            
        } catch (Exception e) {
            return ResponseEntity.ok(new LoginResponse(false, "Authentication failed: " + e.getMessage(), null));
        }
    }
    
    static class LoginRequest {
        private String username;
        private String password;
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
        
        public String getPassword() {
            return password;
        }
        
        public void setPassword(String password) {
            this.password = password;
        }
    }
    
    static class LoginResponse {
        private boolean success;
        private String message;
        private String username;
        
        public LoginResponse(boolean success, String message, String username) {
            this.success = success;
            this.message = message;
            this.username = username;
        }
        
        public boolean isSuccess() {
            return success;
        }
        
        public void setSuccess(boolean success) {
            this.success = success;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
    }
}