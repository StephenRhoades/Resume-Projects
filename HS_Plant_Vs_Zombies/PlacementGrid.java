import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
/**
 * Write a description of class PlacementGrid here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public abstract class PlacementGrid extends Actor
{
    /**
     * Act - do whatever the PlacementGrid wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        // Add your action code here.
    }    
    public int setX( int x)
    {
        int place = 80;
        for(int i = 0; i < 9; i++)
        {
            if(x < place + 42 && x > place - 42)
            {
                return place;
            }
                place += 80 ;
        }
        return 0;
    }
    public int setY( int y)
    {
        int place = 120;
        for(int i = 0; i < 5; i++)
        {
            if(y < place + 52 && y > place - 52)
            {
                return place;
            }
                place += 100;
        }
        return 0;
    }
}
