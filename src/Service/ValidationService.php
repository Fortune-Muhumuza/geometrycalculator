<?php

namespace App\Service;

class ValidationService {
    public function validateTriangleInequality(float $a, float $b, float $c): bool {
        return ($a + $b > $c) && ($b + $c > $a) && ($a + $c > $b);
    }

    public function validatePositiveNumber(float $number): bool {
        return $number > 0;
    }
}