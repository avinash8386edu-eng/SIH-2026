package com.polaris.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.polaris.model.Emergency;
import com.polaris.model.EmergencyStatus;
import com.polaris.model.EmergencyType;
import com.polaris.model.EmergencySeverity;
import com.polaris.repository.EmergencyRepository;
import com.polaris.service.SmsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
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
    private SmsService smsService;

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

        when(emergencyRepository.save(any(Emergency.class))).thenReturn(saved);

        mockMvc.perform(post("/api/emergency/sos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andExpect(jsonPath("$.id").value(1));

        verify(messagingTemplate).convertAndSend(eq("/topic/sos"), any(Emergency.class));
        verify(smsService).broadcastSatelliteSOS(any(String.class), any(String.class));
    }
}
