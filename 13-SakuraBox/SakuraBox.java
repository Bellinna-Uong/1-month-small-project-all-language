import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import java.util.Random;

public class SakuraBox extends JFrame {
    private ArrayList<Point> flowers = new ArrayList<>();
    private JTextField inputField;
    private JPanel drawingPanel;

    public SakuraBox() {
        setTitle("🌸 Secret Sakura Box");
        setSize(500, 500);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        // Panneau de dessin (Le jardin)
        drawingPanel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                drawTree(g);
                drawFlowers(g);
            }
        };
        drawingPanel.setBackground(new Color(255, 240, 245)); // Rose pâle
        add(drawingPanel, BorderLayout.CENTER);

        // Zone de saisie (Les vœux)
        inputField = new JTextField();
        inputField.addActionListener(e -> {
            if (!inputField.getText().isEmpty()) {
                addFlower();
                inputField.setText(""); // Efface le texte après validation
            }
        });
        add(new JLabel(" Tape un voeu et appuie sur Entrée :", SwingConstants.CENTER), BorderLayout.NORTH);
        add(inputField, BorderLayout.SOUTH);
    }

    private void drawTree(Graphics g) {
        g.setColor(new Color(101, 67, 33)); // Marron tronc
        g.fillRect(240, 300, 20, 100); // Tronc simple
        g.drawArc(150, 150, 200, 200, 0, 180); // Branche simple
    }

    private void addFlower() {
        Random rand = new Random();
        // On génère des fleurs autour des branches
        int x = rand.nextInt(200) + 150;
        int y = rand.nextInt(100) + 150;
        flowers.add(new Point(x, y));
        drawingPanel.repaint(); // Force la fenêtre à se redessiner
    }

    private void drawFlowers(Graphics g) {
        g.setColor(new Color(255, 183, 197)); // Couleur Sakura
        for (Point p : flowers) {
            g.fillOval(p.x, p.y, 15, 15);
            g.setColor(Color.WHITE);
            g.fillOval(p.x + 5, p.y + 5, 5, 5); // Coeur de la fleur
            g.setColor(new Color(255, 183, 197));
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            new SakuraBox().setVisible(true);
        });
    }
}