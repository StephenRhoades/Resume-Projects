import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.util.List;
/**
 * Write a description of class Zombie here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class Zombie extends Actor
{
    private GifImage gifImage, walk, headLost, headLostAttack, attack, die;
    private GreenfootImage currentImage;
    private List<GreenfootImage> list;
    private int time = 0;
    private boolean dead, eating, walking, stop, fade, first;
    private int place, health1, health2, delay, trans, speed;
    public Zombie(GifImage walk, GifImage headLost, GifImage headLostAttack, GifImage attack, 
    GifImage die, int health1, int health2, int speed)
    {
        double type = Math.random();
        gifImage = walk;
        this.walk = walk;
        this.headLost = headLost;
        this.headLostAttack = headLostAttack;
        this.attack = attack;
        this.die = die;
        this.speed = speed;
        delay = 0;
        this.health1 = health1;
        this.health2 = health2;
        trans = 250;
        dead = false;
        fade = false;
        eating = false;
        walking = true;
        stop = false;
        first = false;
        place = -62;
        currentImage = new GreenfootImage("blank.png");
        currentImage.drawImage(gifImage.getCurrentImage(), place, -12);
        list = gifImage.getImages();
        die.pause();
    }
    public void act() 
    {
        if (FrontYard.getPlaying())
        {
            if (!fade)
            {
                delay++;
                currentImage = gifImage.getCurrentImage();
                if(getX() == 0)
                {
                    currentImage.drawImage(gifImage.getCurrentImage(), place, -12);
                }
                if(time == 120)
                {
                    setLocation(getX() - 60, getY());
                }
                
                if((time < 140 || gifImage.getIndex() < list.size() - 1 ) && !stop)
                {
                    setImage(currentImage);
                }
                else
                {
                    stop = true;
                }
                snap();
                if(getOneObjectAtOffset(-18, 0, Plant.class) != null && time < 1)
                {
                    eat();
                }
                else if(!dead && !(( health1 <=0 || dead) && eating) && time != 1 )
                {
                    walk();
                }
                if ( health2 <= 0 && !first)
                {
                    die2();
                    first = true;
                }
                if ( health1 <=0 || dead)
                {
                    die();
                }
                else if(getX() < 0)
                {
                    Lose lose = new Lose();
                    getWorld().addObject(lose, 400, 285);
                    FrontYard.notPlaying();
                }
            }
            else
            {
                fade();
                if (trans < 5)
                {
                    getWorld().removeObject(this);
                }
            }
        }
    }    
    public void setImages( GifImage walk, GifImage headLost, GifImage headLostAttack, GifImage attack, 
    GifImage die)
    {
        this.walk = walk;
        this.headLost = headLost;
        this.headLostAttack = headLostAttack;
        this.attack = attack;
        this.die = die;
    }
    public void loseHealth()
    {
        if (health2 > 0)
        {
            health2 --;
        }
        else
        {
            health1 --;
        }
    }
    public boolean isAttacking()
    {
        return eating;
    }
    public boolean isDead()
    {
        return dead;
    }
    public void walk()
    {
        if(!walking)
        {
            gifImage = walk;
        }
        if (delay > speed + 1)
        {
            if( time < 120 )
            {
                setLocation(getX()-1, getY());
                delay = 0;
            }
        }
        walking = true;
        eating = false;
    }
    public void eat()
    {
        if(!eating)
        {
            gifImage = attack;
        }
        if(delay > speed * 2 && time < 120)
        {
            ((Plant)(getOneObjectAtOffset(-18, 0, Plant.class))).loseHealth();
            delay = 0;
        }
        currentImage = gifImage.getCurrentImage();
        setImage(currentImage);
        eating = true;
        walking = false;
    }
    public void die2()
    {
        walk = new GifImage("Zombie.gif");
        attack = new GifImage("ZombieAttack.gif");
        if (eating)
        {
            gifImage = attack;
        }
        else
        {
            gifImage = walk;
        }
    }
    public void die()
    {
        time ++;
        if(time == 1)
        {
            gifImage = headLost;
            if(isAttacking())
            {
                gifImage = headLostAttack;
            }
            ZombieHead head = new ZombieHead(getX(), getY()-34, new GreenfootImage("ZombieHead.gif"));
            getWorld().addObject(head, getX(), getY()-34);
        }
        if(time == 120)
        {
            die.resume();
            gifImage = die;
            list = gifImage.getImages();
            dead = true;
            setLocation(getX() + 5, getY());
        }
        if(time == 240)
        {
            fade = true;
        }
    }
    public void snap()
    {
        setLocation(getX(), (getY()/100)*100 + 20);
        if(getY() == 20)
        {
            setLocation(getX(), 120);
        }
    }
    public int getPlace()
    {
        return place;
    }
    public void setTime(int num)
    {
        time = num;
    }
    public void mow()
    {
        die();
        if(!dead)
        {
            dead = true;
            time = 119;
            health1 = 0;
        }
        
    }
    public void fade()
    {
        trans--;
        getImage().setTransparency(trans);
    }
}
