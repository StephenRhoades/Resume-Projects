import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class SunFlower here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class SunFlower extends Plant
{
    public SunFlower()
    {
        super(50, 4, 0, 24, new GifImage("SunFlower.gif"), "SunFlower");
    }
    public void act() 
    {
        super.act();
    }    
    public void special()
    {
        Sun sun = new Sun(getX(), getY() - 20, false);
        getWorld().addObject(sun, getX(), getY() - 20);
        fix();
    }
    public boolean requirement()
    {
        if (getDelay() > 2000 && getDelay() % 30 == 0)
        {
            shade(5);
        }
        return true;
    }
    /*
    public String toString()
    {
        return "SunFlower";
    }
    public static int getCost()
    {
        return cost;
    }
    public void loseHealth()
    {
        this.health--;
    }
    public void shade(int num)
    {
        for(int i = 0 ; i < gifImage.getImages().size(); i++)
        {
            GreenfootImage imag = gifImage.getImages().get(i);
            for(int y = 0; y < imag.getHeight(); y++ )
            {
                for(int x = 0; x < imag.getWidth(); x++ )
                {
                    Color c = imag.getColorAt(x,y);
                    if (c.getAlpha() > 1)
                    {
                        if(c.getRed() + num < 255)
                        {
                            c = new Color(c.getRed() + num, c.getGreen(), c.getBlue());
                            array[i][y][x][0] += num;
                        }
                        if(c.getGreen() + num < 255)
                        {
                            c = new Color(c.getRed(), c.getGreen() + num, c.getBlue());
                            array[i][y][x][1] += num;
                        }
                        if(c.getBlue() + num < 255)
                        {
                            c = new Color(c.getRed(), c.getGreen(), c.getBlue() + num);
                            array[i][y][x][2] += num;
                        }
                        imag.setColorAt(x, y, c);
                    }
                }
            }
        }
        bright ++;
    }
    public void fix()
    {
        for(int i = 0 ; i < gifImage.getImages().size(); i++)
        {
            GreenfootImage imag = gifImage.getImages().get(i);
            for(int y = 0; y < imag.getHeight(); y++ )
            {
                for(int x = 0; x < imag.getWidth(); x++ )
                {
                    Color c = imag.getColorAt(x,y);
                    if (c.getAlpha() > 1)
                    {
                        c = new Color(c.getRed() - array[i][y][x][0], c.getGreen() - array[i][y][x][1], c.getBlue() - array[i][y][x][2]);
                        array[i][y][x][0] = 0;
                        array[i][y][x][1] = 0;
                        array[i][y][x][2] = 0;
                        imag.setColorAt(x, y, c);
                    }
                }
            }
        }
        bright = 0;
    }*/
}
