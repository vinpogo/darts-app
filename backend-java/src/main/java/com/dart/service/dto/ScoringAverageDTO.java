package com.dart.service.dto;

import com.dart.repository.wrappers.ScoringValue;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ScoringAverageDTO {
    private String scoringField;
    private ScoringValue scoringValue;
}
