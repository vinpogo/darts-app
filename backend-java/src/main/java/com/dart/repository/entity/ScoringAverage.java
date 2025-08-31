package com.dart.repository.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

import java.util.Optional;

@Entity
public class ScoringAverage extends PanacheEntity {
    public String scoringField;
    public String scoringValue;

    public static Optional<ScoringAverage> findByScoringField(String scoringField) {

        return find("scoringField", scoringField).firstResultOptional();
    }
}
