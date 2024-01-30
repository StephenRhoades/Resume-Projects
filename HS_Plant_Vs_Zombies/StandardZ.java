import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class StandardZ here.
 * 
 * @author Stephen Rhoades 
 * @version 2/13/2021
 */
public class StandardZ extends Zombie
{

    public StandardZ()
    {
        super(new GifImage("Zombie.gif"), new GifImage("ZombieLostHead.gif"), new GifImage("ZombieLostHeadAttack.gif"),
        new GifImage("ZombieAttack.gif"), new GifImage("ZombieDie.gif"), 10, 0, 5);
    }
    public void act() 
    {
        super.act();
    }    
    public void die()
    {
        super.die();
        FrontYard.incScore(1);
    }
}
