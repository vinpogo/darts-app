package com.dart.service.dto;

import com.dart.repository.entity.ScoringAverage;
import com.dart.repository.wrappers.ScoringValue;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ScoringAverageMapper {
    public static ScoringAverageDTO mapScoringAverageToScoringAverageDTO(ScoringAverage sa) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return new ScoringAverageDTO(sa.scoringField, objectMapper.readValue(sa.scoringValue, ScoringValue.class));
    }
}
