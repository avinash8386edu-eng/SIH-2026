package com.polaris.service;

import com.polaris.model.DocumentRecord;
import com.polaris.model.DocumentType;
import com.polaris.repository.DocumentRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DocumentArchiveService {

    private final DocumentRecordRepository documentRecordRepository;

    public void archiveSOS(String title, String content, Long expeditionId, String createdBy) {
        saveDocument(title, DocumentType.SOS_LOG, content, expeditionId, createdBy);
    }

    public void archiveCargoCert(String title, String content, Long expeditionId, String createdBy) {
        saveDocument(title, DocumentType.CARGO_CERT, content, expeditionId, createdBy);
    }

    public void archiveInventoryAudit(String title, String content, Long expeditionId, String createdBy) {
        saveDocument(title, DocumentType.INVENTORY_AUDIT, content, expeditionId, createdBy);
    }

    private void saveDocument(String title, DocumentType type, String content, Long expeditionId, String createdBy) {
        DocumentRecord record = DocumentRecord.builder()
                .title(title)
                .type(type)
                .content(content)
                .expeditionId(expeditionId)
                .createdBy(createdBy)
                .createdAt(LocalDateTime.now())
                .build();
        documentRecordRepository.save(record);
    }
}
