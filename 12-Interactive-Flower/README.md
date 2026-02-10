# Interactive Spring Flower Garden

A beautiful, interactive flower drawing experience using Python's Turtle Graphics. Click anywhere on the screen to plant colorful flowers!

## Features

- **Click-to-Draw Flowers**: Click anywhere to generate a unique flower
- **Randomized Design**: Each flower has random:
  - Colors (8 beautiful pastel colors)
  - Petal counts (6-12 petals)
  - Petal sizes
- **Spring Aesthetic**: Soft green background with colorful flowers
- **Smooth Graphics**: Uses Turtle Graphics for beautiful rendered output

## How to Use

1. Make sure Python 3.x is installed with Turtle Graphics
2. Run the script: `python main.py`
3. Click anywhere on the canvas to plant a flower
4. Watch as beautiful flowers bloom at your cursor location
5. Create your own unique flower garden!
6. Close the window when you're done

## Features of Generated Flowers

- **Petal Design**: Each petal is drawn using two arcs
- **Random Colors**: Chosen from 8 beautiful pastel shades:
  - Pink (#ffc9d4)
  - Rose (#ed9a9a)
  - Lavender (#adbbff)
  - Peach (#ffdfba)
  - Yellow (#ffffba)
  - Lilac (#dedaf4)
  - Mint (#e4f1ee)
  - Sky Blue (#d9edf8)
- **Yellow Center**: Each flower has a golden center dot

## Requirements

- Python 3.x
- Turtle Graphics module (comes built-in with Python)

## Installation

```bash
python main.py
```

## Customization

You can modify:
- Canvas size (width and height parameters in `screen.setup()`)
- Background color (`screen.bgcolor()`)
- Petal count range (currently 6-12)
- Petal size range (currently 30-70)
- Colors available for flowers
- Center dot size

## File Structure

- `main.py` - Main application with flower drawing logic

## How It Works

1. **Click-to-Plant**: The `screen.onclick()` event listener detects clicks
2. **Random Generation**: Each flower gets random petals and size
3. **Petal Drawing**: The `draw_petaal()` function creates petal shapes
4. **Flower Placement**: Flowers are centered at your click location
5. **Center Design**: A golden dot is placed in the center of each flower

## Perfect For

- Relaxation and creative expression
- Understanding Python graphics programming
- Digital art and flower design exploration
- Mindful clicking activities

## Fun Variations

Try:
- Planting flowers in specific patterns
- Creating a flower gradient
- Overlapping flowers for unique effects
- Rapid-clicking to create a dense garden
