import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Menu_Peashooter here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class Menu_Peashooter extends Menu
{
    private GreenfootImage image = new GreenfootImage("menu_peashooter.png");
    private GreenfootImage alt = new GreenfootImage("menu_peashooter.png");
    private GreenfootImage dark = new GreenfootImage("menu_peashooter.png");
    private int prev;
    private static int time = 751;
    private double coolDown = 7.5;
    public Menu_Peashooter()
    {
        image.scale(45,65);
        alt.scale(45,65);
        alt = shade(alt);
        setImage(alt);
        prev = 0;
    }
    public void act() 
    {
        if (FrontYard.getPlaying())
        {
            if(Greenfoot.mouseClicked(this)&& Menu.getSun() >= 100 &&
            time > (int)(coolDown * 100))
            {
                Placer obj = new Placer(new GreenfootImage("Peashooter.gif"));
                MouseInfo ms = Greenfoot.getMouseInfo();
                getWorld().addObject(obj, ms.getX(), ms.getY());
            }
            shadow();
            shadow2();
            prev = Menu.getSun();
        }
    }    
    public void shadow()
    {
        if(prev != Menu.getSun())
        {
            if(Menu.getSun() >= 100)
            {
                setImage(image);
            }
            else
            {
                setImage(alt);
            }
        }
    }
    public void shadow2()
    {
        if(time < coolDown * 100)
        {
            dark = new GreenfootImage("menu_peashooter.png");
            dark.scale(45,65);
            setImage(shade(shade(dark), (double)(time/100.0), coolDown));
            time ++;
        }
        if(time == (int)(coolDown * 100))
        {
            if(Menu.getSun() >= 100)
            {
                setImage(image);
            }
            else
            {
                setImage(alt);
            }
            time ++;
        }
    }
    public static void placed()
    {
        time = 0;
    }
}
