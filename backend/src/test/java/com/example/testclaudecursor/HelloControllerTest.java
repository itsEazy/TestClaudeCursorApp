package com.example.testclaudecursor;

import io.restassured.module.mockmvc.RestAssuredMockMvc;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.test.web.servlet.MockMvc;

import static io.restassured.module.mockmvc.RestAssuredMockMvc.given;
import static org.hamcrest.Matchers.*;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(HelloController.class)
@SpringJUnitConfig
class HelloControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        RestAssuredMockMvc.mockMvc(mockMvc);
    }

    @Test
    void testGetHelloMessage() {
        given()
        .when()
            .get("/hello")
        .then()
            .statusCode(200)
            .body("message", equalTo("Hello World"));
    }

    @Test
    void testGetHelloMessageReturnsCorrectContentType() {
        given()
        .when()
            .get("/hello")
        .then()
            .statusCode(200)
            .contentType("application/json");
    }

    @Test
    void testGetHelloMessageStructure() {
        given()
        .when()
            .get("/hello")
        .then()
            .statusCode(200)
            .body("message", instanceOf(String.class))
            .body("message", not(emptyString()));
    }
}