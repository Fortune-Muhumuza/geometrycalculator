<?php

namespace App\Controller;

use App\Model\Circle;
use App\Model\Triangle;
use App\Service\GeometryCalculator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class GeometryController extends AbstractController {
    private GeometryCalculator $calculator;

    public function __construct(GeometryCalculator $calculator) {
        $this->calculator = $calculator;
    }

    #[Route('/circle/{radius}', methods: ['GET'])]
    public function circle(float $radius): JsonResponse {
        $circle = new Circle($radius);
        
        return new JsonResponse([
            'type' => 'circle',
            'radius' => $radius,
            'surface' => $circle->calculateSurface(),
            'circumference' => $circle->calculateCircumference()
        ]);
    }

    #[Route('/triangle/{a}/{b}/{c}', methods: ['GET'])]
    public function triangle(float $a, float $b, float $c): JsonResponse {
        $triangle = new Triangle($a, $b, $c);
        
        return new JsonResponse([
            'type' => 'triangle',
            'a' => $a,
            'b' => $b,
            'c' => $c,
            'surface' => $triangle->calculateSurface(),
            'circumference' => $triangle->calculateCircumference()
        ]);
    }
}