<?php

namespace App\Service;

use App\Interface\ShapeInterface;

class GeometryCalculator {
    public function sumSurfaces(ShapeInterface $shape1, ShapeInterface $shape2): float {
        return $shape1->calculateSurface() + $shape2->calculateSurface();
    }

    public function sumCircumferences(ShapeInterface $shape1, ShapeInterface $shape2): float {
        return $shape1->calculateCircumference() + $shape2->calculateCircumference();
    }
}