package com.dart.service;

import com.dart.records.DartShot;
import com.dart.service.dto.ScoringAverageDTO;

import java.util.List;

public interface IScoringService {
    // POST
    List<ScoringAverageDTO> processShots(DartShot[] shots);
}
