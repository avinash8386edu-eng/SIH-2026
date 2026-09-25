package com.polaris.repository;

import com.polaris.model.DocumentRecord;
import com.polaris.model.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRecordRepository extends JpaRepository<DocumentRecord, Long> {
    List<DocumentRecord> findByType(DocumentType type);
    List<DocumentRecord> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String title, String content);
}
