<?php


namespace App\Controller;

use App\Model\Circle;
use App\Model\Triangle;
use App\Service\GeometryCalculator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api', name: 'api_')]
class GeometryController extends AbstractController
{
    private GeometryCalculator $calculator;
    private SerializerInterface $serializer;

    public function __construct(
        GeometryCalculator $calculator,
        SerializerInterface $serializer
    ) {
        $this->calculator = $calculator;
        $this->serializer = $serializer;
    }

    #[Route('/circle/{radius}', name: 'circle', methods: ['GET'])]
    public function circle(float $radius): JsonResponse {
        $circle = new Circle($radius);
        $surface = $circle->calculateSurface();
        $circumference = $circle->calculateCircumference();
        
        // Save calculation to database
        $this->calculator->saveCalculation('circle', ['radius' => $radius], $surface, $circumference);
        
        return new JsonResponse([
            'type' => 'circle',
            'radius' => $radius,
            'surface' => $surface,
            'circumference' => $circumference
        ]);
    }

    #[Route('/triangle/{a}/{b}/{c}', name: 'triangle', methods: ['GET'])]
    public function triangle(float $a, float $b, float $c): JsonResponse {
        $triangle = new Triangle($a, $b, $c);
        $surface = $triangle->calculateSurface();
        $circumference = $triangle->calculateCircumference();
        
        // Save calculation to database
        $this->calculator->saveCalculation('triangle', [
            'a' => $a,
            'b' => $b,
            'c' => $c
        ], $surface, $circumference);
        
        return new JsonResponse([
            'type' => 'triangle',
            'a' => $a,
            'b' => $b,
            'c' => $c,
            'surface' => $surface,
            'circumference' => $circumference
        ]);
    }

    #[Route('/history', name: 'history', methods: ['GET'])]
    public function getHistory(): JsonResponse
    {
        $history = $this->calculator->getRecentCalculations();
        
        // Convert to array before sending response
        $normalizedHistory = array_map(function($calculation) {
            return [
                'id' => $calculation->getId(),
                'shapeType' => $calculation->getShapeType(),
                'parameters' => $calculation->getParameters(),
                'surface' => $calculation->getSurface(),
                'circumference' => $calculation->getCircumference(),
                'calculatedAt' => $calculation->getCalculatedAt()->format('Y-m-d H:i:s')
            ];
        }, $history);
        
        return new JsonResponse($normalizedHistory);
    }

    #[Route('/stats/{shapeType}', name: 'stats', methods: ['GET'])]
    public function getStats(string $shapeType): JsonResponse
    {
        $stats = $this->calculator->getShapeStatistics($shapeType);
        
        // Ensure numeric values are properly formatted
        if ($stats) {
            $stats = array_map(function($value) {
                return is_numeric($value) ? (float)$value : $value;
            }, $stats);
        }
        
        return new JsonResponse($stats ?? ['message' => 'No statistics available']);
    }
}