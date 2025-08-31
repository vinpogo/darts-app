package com.dart.controller;

import com.dart.records.DartShot;
import com.dart.repository.entity.ScoringAverage;
import com.dart.service.IScoringService;
import com.dart.service.dto.ScoringAverageDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/")
public class DartsController {
    @Autowired
    private IScoringService iScoringService;

    @PostMapping
    public List<ScoringAverageDTO> processShots(@RequestBody DartShot[] shots) {
        return iScoringService.processShots(shots);
    }

    @GetMapping
    public List<ScoringAverage> getAllShots() {
        return ScoringAverage.listAll();
    }
}
