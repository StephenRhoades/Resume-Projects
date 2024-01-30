import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Place here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class Place extends PlacementGrid
{
    private GreenfootImage image, original;
    private String type;
    public Place(GreenfootImage imag)
    {
        original = imag;
        type = original.toString();
        type = type.substring(type.indexOf(":") + 2, type.indexOf(".") + 4);
        image = new GreenfootImage(type);
        original = new GreenfootImage(type);
        image.setTransparency(0);
        original.setTransparency(200);
        setImage(original);
    }
    public void act() 
    {
        if (FrontYard.getPlaying())
        {
            MouseInfo ms = Greenfoot.getMouseInfo();
            if(ms != null)
            {
                snap();
                if(isTouching())
                {
                    setImage(image);
                    if(Greenfoot.mousePressed(getOneIntersectingObject(Placer.class)))
                    {
                        getWorld().removeObject(this);
                    }
                }
                else if(ms.getClickCount() > 0 || Greenfoot.mousePressed(getOneIntersectingObject(Placer.class)))
                {                
                    Plant obj;
                    if(type.equals("Peashooter.gif"))
                    {
                        obj = new Peashooter();
                        Menu_Peashooter.placed();
                        getWorld().addObject(obj, getX(), getY());
                    }
                    else if(type.equals("WallNut.gif"))
                    {
                        obj = new WallNut();
                        Menu_Wallnut.placed();
                        getWorld().addObject(obj, getX(), getY());
                    }
                    else if(type.equals("SunFlower.gif"))
                    {
                        obj = new SunFlower();
                        Menu_Sunflower.placed();
                        getWorld().addObject(obj, getX(), getY());
                    }
                    getWorld().removeObject(this);
                }
                else
                {
                    setImage(original);
                }
            }
        }
    }   
    public void snap()
    {
        MouseInfo ms = Greenfoot.getMouseInfo();
        if(setX(ms.getX()) != 0 && setY(ms.getY()) != 0)
        {
            setLocation(setX(ms.getX()), setY(ms.getY()));
        }
        else if(setY(ms.getY()) != 0)
        {
            setLocation(setX(ms.getX()), ms.getY());
        }
        else if(setY(ms.getY()) != 0)
        {
            setLocation(ms.getX(), setY(ms.getY()));
        }
        else
        {
            setLocation(ms.getX(), ms.getY());
        }
    }
    public boolean isTouching()
    {
        return isTouching(Plant.class)|| setX(getX()) == 0 || setY(getY()) == 0;
    }
}
