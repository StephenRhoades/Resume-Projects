import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Plants here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class Plant extends Delayer
{
    private GifImage gifImage;
    private int health, cost, bright, delay, power;
    private double shootSpeed;
    private String projectile, name;
    private int [][][][] array;
    public Plant(int cost, int health, int power, double shootSpeed, GifImage gifImage, String name)
    {
        this.name = name;
        this.gifImage = gifImage;
        this.health = health;
        this.shootSpeed = shootSpeed;
        this.cost = cost;
        delay = 0;
        bright = 0;
        cycleImage();
        Menu.setSun(Menu.getSun()- cost);
        GreenfootImage imag = gifImage.getCurrentImage();
        array = new int[gifImage.getImages().size()][imag.getHeight()][imag.getWidth()][3];
    }
    public void act() 
    {
        
        if (FrontYard.getPlaying())
        {
            cycleImage();
            if((int)(shootSpeed)*100 == delay)
            {
                delay = 0;
                special();
            }
            else if(requirement())
            {
                delay++;
            }
            if(health <= 0)
            {
                getWorld().removeObject(this);
            }
        }
    }     
    public void special(){}
    public int getHealth()
    {
        return health;
    }
    public boolean requirement()
    {
        return false;
    }
    public void setImage(GifImage image)
    {
        gifImage = image;
    }
    public void cycleImage()
    {
        super.setImage(gifImage.getCurrentImage());
    }
    public String toString()
    {
        return name;
    }
    public int getDelay()
    {
        return delay;
    }
    public void loseHealth()
    {
        health--;
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
    }
}
