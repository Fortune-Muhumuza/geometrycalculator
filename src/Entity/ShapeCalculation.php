<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;

#[ORM\Entity]
#[ORM\Table(name: 'shape_calculations')]
class ShapeCalculation implements JsonSerializable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: 'string')]
    private string $shapeType;

    #[ORM\Column(type: 'json')]
    private array $parameters;

    #[ORM\Column(type: 'float')]
    private float $surface;

    #[ORM\Column(type: 'float')]
    private float $circumference;

    #[ORM\Column(type: 'datetime')]
    private \DateTime $calculatedAt;

    public function __construct(string $shapeType, array $parameters, float $surface, float $circumference)
    {
        $this->shapeType = $shapeType;
        $this->parameters = $parameters;
        $this->surface = $surface;
        $this->circumference = $circumference;
        $this->calculatedAt = new \DateTime();
    }

    // Implement JsonSerializable interface
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'shapeType' => $this->shapeType,
            'parameters' => $this->parameters,
            'surface' => $this->surface,
            'circumference' => $this->circumference,
            'calculatedAt' => $this->calculatedAt->format('Y-m-d H:i:s')
        ];
    }

    // getters and setters
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getShapeType(): string
    {
        return $this->shapeType;
    }

    public function getParameters(): array
    {
        return $this->parameters;
    }

    public function getSurface(): float
    {
        return $this->surface;
    }

    public function getCircumference(): float
    {
        return $this->circumference;
    }

    public function getCalculatedAt(): \DateTime
    {
        return $this->calculatedAt;
    }
}