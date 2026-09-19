package com.polaris.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.polaris.model.Emergency;
import com.polaris.model.EmergencySeverity;
import com.polaris.model.EmergencyType;
import com.polaris.repository.EmergencyRepository;
import com.polaris.security.JwtService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmergencyController.class)
public class EmergencyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmergencyRepository emergencyRepository;

    @MockBean
    private SimpMessagingTemplate messagingTemplate;

    @MockBean
    private JwtService jwtService;

    @Test
    @WithMockUser(roles = "SCIENTIST")
    void testTriggerSOS() throws Exception {
        Emergency request = new Emergency();
        request.setType(EmergencyType.MEDICAL);
        request.setSeverity(EmergencySeverity.CRITICAL);
        request.setDescription("Blizzard trap!");
        request.setLatitude(-70.7667);
        request.setLongitude(11.7333);

        Emergency saved = new Emergency();
        saved.setId(1L);
        saved.setType(EmergencyType.MEDICAL);
        saved.setSeverity(EmergencySeverity.CRITICAL);
        saved.setDescription("Blizzard trap!");
        saved.setStatus(EmergencyStatus.ACTIVE);
        saved.setLatitude(-70.7667);
        saved.setLongitude(11.7333);

        Mockito.when(emergencyRepository.save(Mockito.any(Emergency.class))).thenReturn(emergency);

        mockMvc.perform(post("/api/emergency/sos").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emergency)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Marine VHF")))
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("INMARSAT")));
    }

    @Test
    @WithMockUser
    public void testPolarRouting_LatitudeLessThanMinus60() throws Exception {
        Emergency emergency = new Emergency();
        emergency.setType(EmergencyType.WEATHER);
        emergency.setSeverity(EmergencySeverity.CRITICAL);
        emergency.setLatitude(-75.0); // On Antarctic Ice Shelf
        emergency.setLongitude(106.0);
        emergency.setReportedBy(11L); // Using ID instead of String

        Mockito.when(emergencyRepository.save(Mockito.any(Emergency.class))).thenReturn(emergency);

        mockMvc.perform(post("/api/emergency/sos").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emergency)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Pinging ALL nearby Field Scientists")))
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Antarctica")));
    }
}
