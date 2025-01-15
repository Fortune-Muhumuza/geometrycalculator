<?php

namespace App\Model;

use App\Interface\ShapeInterface;

class Triangle implements ShapeInterface {
    private float $a;
    private float $b;
    private float $c;

    public function __construct(float $a, float $b, float $c) {
        $this->a = $a;
        $this->b = $b;
        $this->c = $c;
    }

    public function calculateSurface(): float {
        // Using Heron's formula
        $s = ($this->a + $this->b + $this->c) / 2;
        return sqrt($s * ($s - $this->a) * ($s - $this->b) * ($s - $this->c));
    }

    public function calculateCircumference(): float {
        return $this->a + $this->b + $this->c;
    }

    public function getSides(): array {
        return [
            'a' => $this->a,
            'b' => $this->b,
            'c' => $this->c
        ];
    }
}
