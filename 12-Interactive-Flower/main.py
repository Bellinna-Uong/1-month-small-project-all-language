import turtle
import random

#---Configuration---
screen = turtle.Screen()
screen.setup(width=800, height=600)
screen.title("Spring Flower Garden")
screen.bgcolor("#f0fdf4")

t = turtle.Turtle()
t.speed(0)
t.hideturtle()

def draw_petaal(t, radius):
    """Draws a single petal using two arcs."""
    for _ in range (2):
        t.circle(radius, 90)
        t.left(90)

def plant_flower(x, y):
    """Callback function to draw a flower at the mouse click location."""
    t.penup()
    t.goto(x, y)
    t.pendown()

    flower_colors = ["#ffc9d4", "#ed9a9a", "#adbbff", "#ffdfba", "#ffffba","#dedaf4","#e4f1ee","#d9edf8"]
    t.color(random.choice(flower_colors))

    num_petals = random.randint(6, 12)
    size = random.randint(30, 70)

    t.begin_fill()
    for _ in range(num_petals):
        draw_petaal(t, size)
        t.left(360 / num_petals)
    t.end_fill()

    # Drawing the center
    t.penup()
    t.goto(x, y - size / 10)
    t.pendown()
    t.color("#f5dc9b")
    t.dot(size/2.5)

#---Event Listener---
screen.onclick(plant_flower)
turtle.done()