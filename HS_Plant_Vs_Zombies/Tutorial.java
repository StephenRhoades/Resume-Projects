import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)


/**
 * generates a text box explaining the game.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class Tutorial extends Actor
{

    /**
     * Constructor for objects of class Tutorial.
     * 
     */
    public Tutorial()
    {    
        GreenfootImage img = getImage();
        img.setColor(new Color(50,0,0));
        img.drawLine(10, 10, 25, 25);
        img.drawLine(11, 10, 26, 25);
        img.drawLine(10, 11, 25, 26);
        img.drawLine(11, 11, 26, 26);
        img.drawLine(10, 25, 25, 10);
        img.drawLine(11, 25, 26, 10);
        img.drawLine(10, 26, 25, 11);
        img.drawLine(11, 26, 26, 11);
        img.setColor(new Color(20,120,20));
        //img.setFont(new Font("Times New Roman", 1, 20));
        // okay size -In Plants Versus Zombies the point of the game is to-
        String str = "      In Plants Versus Zombies the point of the game\n "
                   + "is to keep zombies from reaching you house. You\n" 
                   + "accomplish this by making plants on a 9 by 5 grid in\n"
                   + "your frontyard. You have to collect \"sun\" by clicking \n"
                   + "them to buy the plants. You purchase plants by \n"
                   + "clicking the desired plant, then moving your mouse\n"
                   + "to where you want to place the plant and click again.\n"
                   + "You can only have one plant in each plot at a time. \n"
                   + "Be careful with your plants, because if a zombie gets \n"
                   + "to close it will start to eat the plant. Walnuts are\n"
                   + "tough plants that won't be eaten quickly, but \n"
                   + "sunflowers and peashooters die very rapidly.\n"
                   + "Sunflowers willprovide you with more sun and\n"
                   + "peashooterswill shootpeas to defeat the zombies. \n"
                   + "There are also differenttypes of zombies. The \n"
                   + "zombies with cones on their headsare the tougher\n"
                   + "than standard zombies, and zombies with buckest on\n"
                   + "their heads are even thougher. If one of the does get\n"
                   + "past your line of plant defense their is a last resort\n"
                   + "line of lawnmowers that will charge down their\n"
                   + "lane if a zombie gets past the last column.";
        img.drawString(str, 10, 52);
    }
    public void act()
    {
        MouseInfo ms = Greenfoot.getMouseInfo();
        if(ms != null && ms.getClickCount() > 0 && ms.getX() > getX() - 222 &&
        ms.getX() < getX() - 200 && ms.getY() < getY() - 250 && ms.getY() > getY() - 270)
        {
            getWorld().removeObject(this);
            
        }
    }
}
