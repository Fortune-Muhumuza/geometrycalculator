<?php

namespace App\Repository;

use App\Entity\ShapeCalculation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ShapeCalculationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ShapeCalculation::class);
    }

    public function findLastCalculations(int $limit = 10): array
    {
        return $this->createQueryBuilder('s')
            ->orderBy('s.calculatedAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function findByShapeType(string $shapeType): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.shapeType = :shapeType')
            ->setParameter('shapeType', $shapeType)
            ->getQuery()
            ->getResult();
    }

    public function getAverageMetricsByType(string $shapeType): array
    {
        return $this->createQueryBuilder('s')
            ->select('
                s.shapeType,
                AVG(s.surface) as avgSurface,
                AVG(s.circumference) as avgCircumference,
                COUNT(s.id) as count
            ')
            ->where('s.shapeType = :shapeType')
            ->setParameter('shapeType', $shapeType)
            ->groupBy('s.shapeType')
            ->getQuery()
            ->getOneOrNullResult();
    }
}