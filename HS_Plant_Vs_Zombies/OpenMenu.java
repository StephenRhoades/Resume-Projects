import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class OpenMenu here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class OpenMenu extends World
{

    /**
     * Constructor for objects of class OpenMenu.
     * 
     */
    public OpenMenu()
    {    
        super(900, 600, 1, true); 
        prepare();
    }

    /**
     * Prepare the world for the start of the program. That is: create the initial
     * objects and add them to the world.
     */
    private void prepare()
    {
        Start start = new Start();
        addObject(start, 640, 130);
        Tutorial_Menu tutorial_menu = new Tutorial_Menu();
        addObject(tutorial_menu, 629, 267);
        Hidden hidden = new Hidden();
        addObject(hidden, 757, 521);
    }
}
