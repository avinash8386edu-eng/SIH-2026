package com.polaris.controller;

import com.polaris.model.DocumentRecord;
import com.polaris.model.DocumentType;
import com.polaris.repository.DocumentRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repository")
@RequiredArgsConstructor
public class DocumentRepositoryController {

    private final DocumentRecordRepository documentRecordRepository;

    @GetMapping
    public ResponseEntity<List<DocumentRecord>> getAllRecords() {
        return ResponseEntity.ok(documentRecordRepository.findAll());
    }

    @GetMapping("/search")
    public ResponseEntity<List<DocumentRecord>> searchRecords(@RequestParam("q") String keyword) {
        return ResponseEntity.ok(documentRecordRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(keyword, keyword));
    }

    @PostMapping
    public ResponseEntity<DocumentRecord> saveRecord(@RequestBody DocumentRecord record) {
        return ResponseEntity.status(HttpStatus.CREATED).body(documentRecordRepository.save(record));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<DocumentRecord>> getRecordsByType(@PathVariable String type) {
        try {
            DocumentType docType = DocumentType.valueOf(type.toUpperCase());
            return ResponseEntity.ok(documentRecordRepository.findByType(docType));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
