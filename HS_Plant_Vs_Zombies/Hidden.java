import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Hidden here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class Hidden extends Actor
{
    /**
     * Act - do whatever the Hidden wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        if(Greenfoot.mouseClicked(this))
        {
            Help hlp = new Help();
            getWorld().addObject(hlp, 450, 300);
        }
    }    
}
