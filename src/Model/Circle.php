<?php

namespace App\Model;

use App\Interface\ShapeInterface;

class Circle implements ShapeInterface {
    private float $radius;

    public function __construct(float $radius) {
        $this->radius = $radius;
    }

    public function calculateSurface(): float {
        return pi() * pow($this->radius, 2);
    }

    public function calculateCircumference(): float {
        return 2 * pi() * $this->radius;
    }

    public function getRadius(): float {
        return $this->radius;
    }
}