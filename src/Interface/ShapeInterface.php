<?php

namespace App\Interface;

interface ShapeInterface {
    public function calculateSurface(): float;
    public function calculateCircumference(): float;
}