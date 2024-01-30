import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Plants here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class Peashooter extends Plant
{
    public Peashooter()
    {
        super(100, 4, 1, 1.5, new GifImage("Peashooter.gif"), "Peashooter");
    }
    public void act() 
    {
        super.act();
    }    
    public void special()
    {
        Pea pea = new Pea();
        getWorld().addObject(pea, getX() + 30, getY() - 20);
    }
    public boolean requirement()
    {
        for(int x = 0; x < 800-getX(); x++)
        {
            if(getOneObjectAtOffset(x, 0, Zombie.class)!= null &&
            !((Zombie)(getOneObjectAtOffset(x, 0, Zombie.class))).isDead())
            {
                return true;
            }
        }
        return false;
    }
}
