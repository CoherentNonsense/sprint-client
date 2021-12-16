const Traveler = function(client) {

  const _client = client;

  let _target = null;


    /////////////
   // Getters //
  /////////////
  function getSkillPoints() { return XP.skill_points; }
  function getDamage() { return XP.dmg; }
  function getMaxHealth() { return XP.max_hp; }
  function getHealth() { return XP.hp; }
  function getMaxSpeed() { return XP.max_sp; }
  function getSpeed() { return XP.sp; }
  function getMaxCarry() { return XP.max_carry; }
  function getCarry() { return XP.carry; }
  function getPosition() { return { x: YOU.x, y: YOU.y }}


  /**
   * Checks if the traveler can sprint
   * @returns boolean
   */
  function canSprint()
  {
    return XP.sp > 9 && !DSTEP.btnIsActive() && _client.world.currentTile().isSprintableTerrain();
  }

  
  /**
   * Makes the traveler sprint if it has the stamina and the terrain allows it.
   */
  function sprint()
  {
    if (this.canSprint())
    {
      DSTEP.click();
    }
  }


  /**
   * Sets the direction the traveler is moving.
   * @param {string} direction n, ne, e, se, s, sw, w, nw
   */
  function move(x, y)
  {
    // x and y can be any number. We move if it is greater than 0.5
    const movingUp = y > 0.5;
    const movingDown = y < -0.5;
    const movingLeft = x < -0.5;
    const movingRight = x > 0.5;

    // Set the direction based on input
    let direction = "";
    if (movingUp) direction = "n";
    if (movingDown) direction = "s";
    if (movingLeft) direction += "w";
    if (movingRight) direction += "e";
    
    // Don't repeatedly click when autowalk is enables
    // and autowalk if you're not
    if (YOU.autowalk && YOU.dir === direction)
    {
      return;
    }
    else if (!YOU.autowalk)
    {
      YOU.autowalk = true;
    }

    if (direction === "")
    {
      YOU.autowalk = false;
      ENGINE.stopPlayerServer();
      return;
    }

    ENGINE.dir(direction, document.getElementById("arrow-" + direction));
  }


  /**
   * Kills the traveler (10% of xp is lost)
   * allowSuicide m ust be set to true
   */
  function suicide()
  {
    HANDS.suicideBtnEl.value = "are you sure?";
    HANDS.suicide();
    ENGINE.addCycleTrigger("YOU.kill();YOU.reincarnate();");
  }


  /**
   * Upgrades a traveler's skill
   * @param {string} skill hp, sp, dmg, carry
   */
  function upgradeSkill(skill)
  {
    if (this.getSkillPoints() < 1) return

    XP.applyJSON.hp = skill === "hp" ? 1 : 0,
    XP.applyJSON.sp = skill === "sp" ? 1 : 0,
    XP.applyJSON.dmg = skill === "dmg" ? 1 : 0,
    XP.applyJSON.carry = skill === "carry" ? 1 : 0,

    XP.applySkills();
  }


  /**
   * Resets the traveler's skill points (10% of xp is lost)
   * allowResetSkillPoints must be set to true
   */
  function resetSkillPoints()
  {
    XP.confirmResetAll();
  }


  /**
   * Sets a target and moves towards it using a*
   * @param {Object} target The coordinates to move towards
   * @param {number} target.x
   * @param {number} target.y
   */
  function moveTo(target)
  {
    _target = target;
  }


  /**
   * Stops moving the traveler (Useful for ending a moveTo() call)
   */
  function stop()
  {
    _target = null;
  }


  /**
   * Simply moves towards target
   * TODO: Better pathfinding
   */
  function _update()
  {
    if (_target)
    {
      if (_target.x == YOU.x && _target.y == YOU.y)
      {
        stop();
        return;
      }

      // Get directions. Either -1 0 or 1
      let xDir = _target.x - YOU.x;
      let yDir = _target.y - YOU.y;

      // Move towards Target
      move(xDir, yDir);
    }
  }

  return {
    _update,
    getSkillPoints,
    getDamage,
    getHealth,
    getMaxHealth,
    getMaxSpeed,
    getMaxCarry,
    getCarry,
    getSpeed,
    getPosition,
    canSprint,
    sprint,
    move,
    suicide,
    upgradeSkill,
    resetSkillPoints,
    moveTo,
    stop
  };

};

export default Traveler;