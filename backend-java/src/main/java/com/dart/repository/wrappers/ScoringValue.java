package com.dart.repository.wrappers;

import jakarta.json.Json;
import jakarta.json.JsonObjectBuilder;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ScoringValue {
    private Long shots;
    private Map<String, Long> hits;

    @Override
    public String toString() {
        JsonObjectBuilder jo = Json.createObjectBuilder();
        jo.add("shots", shots);
        if (hits != null) {
            JsonObjectBuilder jo2 = Json.createObjectBuilder();
            hits.forEach(jo2::add);
            jo.add("hits", jo2.build());
        }

        return jo.build().toString();
    }
}
