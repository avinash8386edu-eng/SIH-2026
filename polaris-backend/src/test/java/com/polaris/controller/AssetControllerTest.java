package com.polaris.controller;

import com.polaris.model.Asset;
import com.polaris.model.AssetStatus;
import com.polaris.repository.AssetRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AssetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AssetRepository assetRepository;

    @Test
    @WithMockUser(roles = "SCIENTIST")
    void testGetAssetByQrCodeFound() throws Exception {
        Asset asset = new Asset();
        asset.setId(10L);
        asset.setName("Ice Core Drill");
        asset.setQrCode("QR-1234");
        asset.setStatus(AssetStatus.IN_USE);

        when(assetRepository.findByQrCode(eq("QR-1234"))).thenReturn(Optional.of(asset));

        mockMvc.perform(get("/api/assets/qr/QR-1234")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Ice Core Drill"))
                .andExpect(jsonPath("$.qrCode").value("QR-1234"));
    }

    @Test
    @WithMockUser(roles = "SCIENTIST")
    void testGetAssetByQrCodeNotFound() throws Exception {
        when(assetRepository.findByQrCode(eq("QR-UNKNOWN"))).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/assets/qr/QR-UNKNOWN")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
