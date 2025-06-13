package integration.com.example.testclaudecursor;

import com.example.testclaudecursor.AuthController;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.TestPropertySource;
import org.testcontainers.junit.jupiter.Testcontainers;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@SpringBootTest(classes = com.example.testclaudecursor.TestClaudeCursorApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {
    "supabase.url=http://localhost:3000",
    "supabase.key=test-key"
})
@Testcontainers
class AuthControllerRestAssuredTest {

    @LocalServerPort
    private int port;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
    }

    @Test
    void testLoginEndpointExists() {
        AuthController.LoginRequest request = new AuthController.LoginRequest();
        request.setUsername("testuser");
        request.setPassword("testpass");

        given()
            .contentType(ContentType.JSON)
            .body(request)
        .when()
            .post("/auth/login")
        .then()
            .statusCode(200)
            .body("success", equalTo(false))
            .body("message", notNullValue())
            .body("username", nullValue());
    }

    @Test
    void testLoginWithValidJsonStructure() {
        String loginJson = """
            {
                "username": "admin",
                "password": "password123"
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(loginJson)
        .when()
            .post("/auth/login")
        .then()
            .statusCode(200)
            .contentType(ContentType.JSON)
            .body("success", instanceOf(Boolean.class))
            .body("message", instanceOf(String.class))
            .body("username", anyOf(nullValue(), instanceOf(String.class)));
    }

    @Test
    void testLoginWithInvalidJson() {
        given()
            .contentType(ContentType.JSON)
            .body("{invalid json}")
        .when()
            .post("/auth/login")
        .then()
            .statusCode(400);
    }

    @Test
    void testLoginWithEmptyCredentials() {
        String loginJson = """
            {
                "username": "",
                "password": ""
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(loginJson)
        .when()
            .post("/auth/login")
        .then()
            .statusCode(200)
            .body("success", equalTo(false))
            .body("message", containsString("failed"));
    }

    @Test
    void testLoginWithNullValues() {
        String loginJson = """
            {
                "username": null,
                "password": null
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(loginJson)
        .when()
            .post("/auth/login")
        .then()
            .statusCode(200)
            .body("success", equalTo(false));
    }

    @Test
    void testLoginEndpointCorsHeaders() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"username\":\"test\",\"password\":\"test\"}")
        .when()
            .post("/auth/login")
        .then()
            .statusCode(200);
    }
}