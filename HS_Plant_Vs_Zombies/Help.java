import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Help here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class Help extends Actor
{
    /**
     * Act - do whatever the Help wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        MouseInfo ms = Greenfoot.getMouseInfo();
        if ( ms != null && ms.getClickCount() > 0)
        {
            getWorld().removeObject(this);
        }
    }    
}
