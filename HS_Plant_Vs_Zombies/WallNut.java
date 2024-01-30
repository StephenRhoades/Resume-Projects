import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class WallNut here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class WallNut extends Plant
{
    private GifImage img1, img2;
    private boolean first, second = true;
    public WallNut()
    {
        super(50, 72, 0, 0, new GifImage("WallNut.gif"), "WallNut");
        img1 = new GifImage("WallNut_cracked1.gif");
        img2 = new GifImage("WallNut_cracked2.gif");
    }
    public void act() 
    {
        if(getHealth() < 40 && first)
        {
            setImage(img1);
            first = false;
        }
        else if(getHealth() < 20 && second)
        {
            setImage(img2);
            second = false;
        }
        super.act();
    }    
    /*public void loseHealth()
    {
        this.health--;
    }
    public String toString()
    {
        return "Wallnut";
    }
    public static int getCost()
    {
        return cost;
    }*/
}
