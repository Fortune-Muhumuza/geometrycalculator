<?php

namespace App\Service;

use App\Entity\ShapeCalculation;
use App\Interface\ShapeInterface;
use App\Repository\ShapeCalculationRepository;
use Doctrine\ORM\EntityManagerInterface;

class GeometryCalculator {
    private EntityManagerInterface $entityManager;
    private ShapeCalculationRepository $repository;

    public function __construct(
        EntityManagerInterface $entityManager,
        ShapeCalculationRepository $repository
    ) {
        $this->entityManager = $entityManager;
        $this->repository = $repository;
    }

    public function sumSurfaces(ShapeInterface $shape1, ShapeInterface $shape2): float {
        return $shape1->calculateSurface() + $shape2->calculateSurface();
    }

    public function sumCircumferences(ShapeInterface $shape1, ShapeInterface $shape2): float {
        return $shape1->calculateCircumference() + $shape2->calculateCircumference();
    }

    public function saveCalculation(string $shapeType, array $parameters, float $surface, float $circumference): void
    {
        $calculation = new ShapeCalculation($shapeType, $parameters, $surface, $circumference);
        $this->entityManager->persist($calculation);
        $this->entityManager->flush();
    }

    public function getShapeStatistics(string $shapeType): array
    {
        return $this->repository->getAverageMetricsByType($shapeType);
    }

    public function getRecentCalculations(int $limit = 10): array
    {
        return $this->repository->findLastCalculations($limit);
    }
}
