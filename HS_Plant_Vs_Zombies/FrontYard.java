import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.util.List;
/**
 * Write a description of class FrontYard_Day here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class FrontYard extends World
{
    private static int score;
    private GreenfootImage dirt = new GreenfootImage("background1unsodded.jpg");
    private GreenfootImage grass1 = new GreenfootImage("background1unsodded1.jpg");
    private GreenfootImage grass2 = new GreenfootImage("background1unsodded2.jpg");
    private GreenfootImage grass = new GreenfootImage("background1.jpg");
    private int delay, inc = 1;
    private int time = 0;
    private int [][] array = {{0}};
    private static boolean playing = true;
    /**
     * Constructor for objects of class FrontYard_Day.
     * 
     */
    public FrontYard()
    {    
        super(800, 570, 1, false); 
        setPic(grass);
        setPaintOrder(Lose.class, PlacementGrid.class, Placer.class, Place.class, Sun.class, Pea.class,
        ZombieHead.class, Zombie.class, Plant.class, LawnMower.class, Menu.class);
        setActOrder(Placer.class, Place.class);
        prepare();
    }
    public static void incScore(int num)
    {
        score += num;
    }
    public static int getScore() 
    {
        return score;
    }
    public void setPic(GreenfootImage image)
    {
        image.drawImage(image, -220, 0);
        setBackground(image);
    }

    /**
     * Prepare the world for the start of the program. That is: create the initial
     * objects and add them to the world.
     */
    private void prepare()
    {
        LawnMower lawnmower = new LawnMower();
        addObject(lawnmower, 0, 120);
        LawnMower lawnmower2 = new LawnMower();
        addObject(lawnmower2, 0, 220);
        LawnMower lawnmower3 = new LawnMower();
        addObject(lawnmower3, 0, 320);
        LawnMower lawnmower4 = new LawnMower();
        addObject(lawnmower4, 0, 420);
        LawnMower lawnmower5 = new LawnMower();
        addObject(lawnmower5, 0, 520);
        Menu menu = new Menu();
        addObject(menu, 220, 40);
        Menu_Wallnut menu_wallnut = new Menu_Wallnut();
        addObject(menu_wallnut, 185, 38);
        Menu_Sunflower menu_sunflower = new Menu_Sunflower();
        addObject(menu_sunflower, 90, 38);
        Menu_Peashooter menu_peashooter = new Menu_Peashooter();
        addObject(menu_peashooter, 137, 38);
    }

    public void act()
    {
        if(playing)
        {
            createS();
            createZ();
            time++;
        }
    }
    
    public void createS()
    {
        if(delay > 2000)
        {
            if(Math.random() > 0)
            {
                int x = (int)(Math.random()*780) + 10;
                Sun sun = new Sun(x, 0, true);
                addObject(sun, x, 0);
            }
            delay = 0;
        }
        delay++;
    }
    
    public void createZ()
    {
        
        if (time >= 5000)
        {
            if(time % 15000 == 0)
            {
                createWave();
            }
            else if(array[0][0] != 0 )
            {
                if( time % 250 == 0 && inc <= array.length)
                {
                    int [] arr = array[array.length - inc];
                    for(int i = 0; i < 5; i++)
                    {
                        int zom = arr[i];
                        if(zom == 1 || zom == 2)
                        {
                            StandardZ zombie = new StandardZ();
                            addObject(zombie, 800, i * 100 + 120);
                        }
                        else if(zom == 3)
                        {
                            ConeHeadZ zombie = new ConeHeadZ();
                            addObject(zombie, 800, i * 100 + 120);
                        }
                        array[array.length - inc][i] = 0;
                    }
                    inc++;
                }
            }
            else if (time >= 20000 && time % 1500 == 0 && Math.random() > .75)
            {
                BucketHeadZ zombie = new BucketHeadZ();
                addObject(zombie, 800, (int)(Math.random()*5) * 100 + 120);
                inc = 1;
            }
            else if (time >= 10000 && time % 1500 == 0 && Math.random() > .5)
            {
                ConeHeadZ zombie = new ConeHeadZ();
                addObject(zombie, 800, (int)(Math.random()*5) * 100 + 120);
                inc = 1;
            }
            else if(time % 1500 == 0 )
            {
                StandardZ zombie = new StandardZ();
                addObject(zombie, 800, (int)(Math.random()*5) * 100 + 120);
                inc = 1;
            }
        }
    }
    public void createWave()
    {
        array = new int[time/5000][5];
        for(int x = 0; x < array.length - 1; x++)
        {
            for(int y = 0; y < array[0].length - 1; y++)
            {
                array[x][y] = (int)(Math.random()*5) + 1;
            }
        }
    }
    public static void notPlaying()
    {
        playing = false;
    }
    public static void isPlaying()
    {
        playing = true;
    }
    public static boolean getPlaying()
    {
        return playing;
    }
}
