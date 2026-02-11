import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.Random;

public class SakuraBox extends JFrame {
    private ArrayList<Point> flowers = new ArrayList<>();
    private JTextField inputField;
    private JPanel drawingPanel;

    public SakuraBox() {
        setTitle("🌸 Secret Sakura Box");
        setSize(500, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        drawingPanel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                // Activer l'anti-aliasing pour des traits lisses
                Graphics2D g2 = (Graphics2D) g;
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                
                drawTree(g2);
                drawFlowers(g2);
            }
        };
        drawingPanel.setBackground(new Color(255, 245, 250)); 
        add(drawingPanel, BorderLayout.CENTER);

        inputField = new JTextField();
        inputField.setFont(new Font("SansSerif", Font.ITALIC, 14));
        inputField.addActionListener(e -> {
            if (!inputField.getText().isEmpty()) {
                addFlower();
                inputField.setText("");
            }
        });

        JPanel bottomPanel = new JPanel(new BorderLayout());
        bottomPanel.add(new JLabel(" Écris un vœu pour faire fleurir l'arbre : "), BorderLayout.NORTH);
        bottomPanel.add(inputField, BorderLayout.CENTER);
        add(bottomPanel, BorderLayout.SOUTH);
    }

    private void drawTree(Graphics2D g) {
        g.setColor(new Color(60, 40, 30)); // Marron foncé
        g.setStroke(new BasicStroke(5)); // Tronc épais

        // Le Tronc
        g.drawLine(250, 500, 250, 350);

        // Les Branches principales
        g.setStroke(new BasicStroke(3));
        g.drawLine(250, 350, 180, 280); // Branche gauche
        g.drawLine(250, 350, 320, 280); // Branche droite
        g.drawLine(250, 380, 250, 250); // Branche centrale

        // Petites branches secondaires
        g.setStroke(new BasicStroke(1));
        g.drawLine(180, 280, 140, 250);
        g.drawLine(180, 280, 200, 220);
        g.drawLine(320, 280, 360, 250);
        g.drawLine(250, 250, 220, 180);
        g.drawLine(250, 250, 280, 180);
    }

    private void addFlower() {
        Random rand = new Random();
        // On définit des zones précises pour que les fleurs tombent sur les branches
        int x = rand.nextInt(240) + 130; // Zone horizontale des branches
        int y = rand.nextInt(150) + 180; // Zone verticale des branches
        flowers.add(new Point(x, y));
        drawingPanel.repaint();
    }

    private void drawFlowers(Graphics2D g) {
        for (Point p : flowers) {
            g.setColor(new Color(255, 182, 193)); 
            g.fillOval(p.x-4, p.y-5, 20, 20);
            g.fillOval(p.x+6, p.y-5, 20, 20);
            g.fillOval(p.x+6, p.y+8, 20, 20);
            g.fillOval(p.x-4, p.y+8, 20, 20);
            
            g.setColor(Color.WHITE);
            g.fillOval(p.x+3, p.y+4, 14, 14);
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new SakuraBox().setVisible(true));
    }
}