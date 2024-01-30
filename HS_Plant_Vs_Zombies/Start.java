import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Start here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class Start extends Actor
{
    /**
     * Act - do whatever the Start wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        MouseInfo ms = Greenfoot.getMouseInfo();
        if(ms != null && ms.getX() < getX() + 155 && ms.getX() > getX() - 155 && ms.getY() < getY() + 40 && 
        ms.getY() > getY() - 50 )
        {
            setImage(new GreenfootImage("start2.png"));
            if(Greenfoot.mouseClicked(this))
            {
                World yard = new FrontYard();
                Greenfoot.setWorld(yard);
                getWorld().removeObject(this);
            }
        }
        else
        {
            setImage(new GreenfootImage("start1.png"));
        }
        
    }    
}
