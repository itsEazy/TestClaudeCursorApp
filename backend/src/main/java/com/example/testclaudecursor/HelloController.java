package com.example.testclaudecursor;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class HelloController {
    
    @GetMapping("/hello")
    public HelloResponse getHelloMessage() {
        return new HelloResponse("Hello World");
    }
    
    static class HelloResponse {
        private String message;
        
        public HelloResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
}