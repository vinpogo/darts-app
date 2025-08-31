package com.dart.service.impl;

import com.dart.records.DartShot;
import com.dart.repository.entity.ScoringAverage;
import com.dart.repository.wrappers.ScoringValue;
import com.dart.service.IScoringService;
import com.dart.service.dto.ScoringAverageDTO;
import com.dart.service.dto.ScoringAverageMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class IScoringServiceImpl implements IScoringService {

    @Override
    @Transactional
    public List<ScoringAverageDTO> processShots(DartShot[] shots) {
        List<ScoringAverageDTO> averages = new ArrayList<>();
        Arrays.stream(shots).forEach(shot -> {
            // Get the scoring average of the aimed shot
            ScoringAverage sa = ScoringAverage.findByScoringField(shot.aim()).orElse(new ScoringAverage());
            sa.scoringField = shot.aim();

            // Calculate the new value of the shots
            try {
                ScoringAverage newScoringAverage = calculateShots(shot, sa);
                averages.add(ScoringAverageMapper.mapScoringAverageToScoringAverageDTO(newScoringAverage));
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        });

        return averages.stream().distinct().toList();
    }

    private ScoringAverage calculateShots(DartShot shot, ScoringAverage activeScoringAverage) throws JsonProcessingException {
        // Parse the JSON string from the scoring average values into the ScoringValue class
        ObjectMapper objectMapper = new ObjectMapper();
        ScoringValue scoringValue = new ScoringValue();
        if (activeScoringAverage.scoringValue != null) {
            scoringValue = objectMapper.readValue(activeScoringAverage.scoringValue, ScoringValue.class);
        }

        // Add the new values to the shots
        scoringValue.setShots((scoringValue.getShots() != null ? scoringValue.getShots() : 0) + 1);
        Map<String, Long> hits = scoringValue.getHits() != null ? scoringValue.getHits() : new HashMap<>();
        hits.putIfAbsent(shot.hit(), 0L);
        hits.computeIfPresent(shot.hit(), (field, shots) -> shots + 1);
        scoringValue.setHits(hits);

        // Convert it to string to persist it
        activeScoringAverage.scoringValue = scoringValue.toString();

        // Persist the new value on the database
        activeScoringAverage.persist();

        return activeScoringAverage;
    }
}
