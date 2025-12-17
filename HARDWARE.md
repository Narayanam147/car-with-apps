# 🔧 Hardware Components Guide

## Complete Hardware Setup for Drone Control System

---

## 📋 Table of Contents

1. [Minimum Requirements (Testing)](#minimum-requirements-testing)
2. [Full Drone Hardware](#full-drone-hardware)
3. [Component Details](#component-details)
4. [Wiring Diagrams](#wiring-diagrams)
5. [Shopping List](#shopping-list)
6. [Assembly Instructions](#assembly-instructions)

---

## 🎯 Minimum Requirements (Testing)

### For Development & Simulator Mode

| Component | Specification | Purpose | Price |
|-----------|--------------|---------|-------|
| **Computer** | Windows/Mac/Linux | Run backend & frontend | - |
| **WiFi Router** | 2.4GHz or 5GHz | Network connectivity | $30-100 |
| **Smartphone** | iOS/Android | Mobile controller (optional) | - |

**Total Cost: $30-100** (if you need a router)

This setup lets you test the entire system in simulator mode!

---

## 🚁 Full Drone Hardware

### Option 1: DIY Quadcopter Build (Recommended for Learning)

#### Core Components

| Component | Specification | Quantity | Purpose | Price Range |
|-----------|--------------|----------|---------|-------------|
| **Raspberry Pi** | Pi 4 Model B (4GB RAM) | 1 | Main flight computer | $55-75 |
| **microSD Card** | 32GB Class 10 (with OS) | 1 | Operating system | $10-15 |
| **Frame** | 450mm quadcopter frame | 1 | Structure | $25-60 |
| **Motors** | Brushless 2212 920KV | 4 | Propulsion | $40-80 |
| **ESCs** | 30A Electronic Speed Controllers | 4 | Motor control | $40-80 |
| **Propellers** | 10x4.5 inch (CW/CCW) | 4+ | Thrust generation | $10-20 |
| **Flight Controller** | Pixhawk/ArduPilot or custom | 1 | Stabilization | $50-150 |
| **Battery** | 11.1V 3S 2200mAh LiPo | 1-2 | Power supply | $25-40 each |
| **Power Distribution Board** | PDB with 5V/12V outputs | 1 | Power distribution | $10-20 |
| **Camera** (Optional) | Raspberry Pi Camera V2 | 1 | FPV video | $25-45 |
| **GPS Module** (Optional) | NEO-6M or NEO-8M | 1 | Position tracking | $15-30 |
| **WiFi Dongle** | USB WiFi adapter (if needed) | 1 | Wireless connection | $10-25 |
| **Cables & Connectors** | Various (JST, XT60, servo) | - | Wiring | $15-30 |
| **Battery Charger** | LiPo balance charger | 1 | Battery charging | $20-50 |
| **RC Transmitter** (Safety) | 6+ channel radio | 1 | Manual override | $50-150 |

**Total DIY Build: $400-900**

---

### Option 2: Pre-Built Drone with Modifications

| Component | Specification | Purpose | Price Range |
|-----------|--------------|---------|-------------|
| **DJI Tello** | Ready-to-fly mini drone | Learning platform | $100-150 |
| **Raspberry Pi Zero W** | Companion computer | Add custom control | $15-25 |
| **Adapter Board** | Tello GPIO interface | Connect Pi to Tello | $20-40 |

**Total Modified Build: $135-215**

⚠️ Note: Some commercial drones have locked firmware and can't be easily modified.

---

### Option 3: Racing Drone (Advanced)

| Component | Specification | Purpose | Price Range |
|-----------|--------------|---------|-------------|
| **Racing Frame** | Carbon fiber 5" frame | Lightweight structure | $40-100 |
| **Racing Motors** | 2306 2400KV brushless | High speed | $60-120 |
| **Racing ESCs** | 4-in-1 35A ESC | Motor control | $40-80 |
| **Flight Controller** | F4/F7 with Betaflight | Fast processing | $40-80 |
| **FPV Camera** | 1200TVL CMOS | Low-latency video | $20-40 |
| **VTX** | 5.8GHz video transmitter | Video transmission | $20-40 |
| **Raspberry Pi Zero 2** | Companion computer | Custom control | $15-25 |
| **LiPo Battery** | 4S 1500mAh | High discharge | $20-35 |

**Total Racing Build: $255-520**

---

## 🔌 Component Details

### 1. Raspberry Pi Setup

#### Recommended Models:

**Raspberry Pi 4 Model B (4GB)** - Best Choice
- Quad-core ARM Cortex-A72 @ 1.5GHz
- 4GB RAM
- Dual-band WiFi (2.4/5GHz)
- Bluetooth 5.0
- GPIO pins for motor control
- USB ports for peripherals

**Raspberry Pi Zero 2 W** - Lightweight Option
- Quad-core ARM Cortex-A53 @ 1GHz
- 512MB RAM
- WiFi (2.4GHz)
- Bluetooth 4.2
- Smaller/lighter for small drones

#### Required Accessories:
- Power supply (5V 3A USB-C for Pi 4)
- Heat sinks (for sustained operation)
- microSD card (32GB minimum)
- Case (optional, for protection)

---

### 2. Motors & ESCs

#### Brushless Motors (2212 920KV example)

**Specifications:**
- **KV Rating**: 920 (RPM per volt)
- **Voltage**: 11.1V (3S LiPo)
- **Thrust**: ~800g per motor
- **Weight**: ~50g each
- **Shaft**: 3.17mm (for propeller mounting)

**Wiring:**
- 3 wires to ESC (order determines direction)
- Swap any 2 wires to reverse direction

#### Electronic Speed Controllers (30A ESCs)

**Specifications:**
- **Current**: 30A continuous, 40A burst
- **Voltage**: 2-4S LiPo (7.4-14.8V)
- **Protocol**: PWM/OneShot125/OneShot42
- **BEC**: 5V output (for servos/accessories)

**Connections:**
- 3 wires to motor
- 2 wires to battery (power)
- 3 wires to flight controller (signal)

---

### 3. Battery System

#### LiPo Battery (11.1V 3S 2200mAh example)

**Specifications:**
- **Voltage**: 11.1V nominal (12.6V full, 9.9V empty)
- **Capacity**: 2200mAh (flight time ~10-15 min)
- **Discharge Rate**: 25C minimum (55A burst)
- **Connector**: XT60 or T-plug
- **Weight**: ~180g

**Safety:**
- Never discharge below 3.3V per cell
- Store at 3.8V per cell (storage voltage)
- Use fireproof LiPo bag for charging/storage
- Never leave charging unattended

---

### 4. Flight Controller Options

#### Option A: Use Pixhawk/ArduPilot
- Full autopilot system
- GPS waypoint navigation
- Telemetry support
- Connect via MAVLink to Raspberry Pi

#### Option B: Custom GPIO Control (Our System)
- Direct motor control from Raspberry Pi
- Requires stabilization code
- More flexible, but requires tuning
- Good for learning

#### Option C: Hybrid (Recommended)
- Use flight controller for stabilization
- Raspberry Pi sends high-level commands
- Best of both worlds

---

### 5. Frame Selection

#### 450mm Quadcopter Frame

**Specifications:**
- **Material**: Fiber glass or carbon fiber
- **Motor Mount**: 16mm diameter arms
- **Mounting**: M3 screws
- **Weight**: 200-400g
- **Clearance**: 10" props maximum

**Included:**
- Main plates (top/bottom)
- Arms (4x)
- Landing gear
- Hardware (screws, standoffs)

---

### 6. Power Distribution

#### Power Distribution Board (PDB)

**Features:**
- Input: XT60 connector for battery
- 4x ESC outputs (direct solder)
- 5V BEC (3A) for Raspberry Pi
- 12V output for FPV equipment
- Current sensor (for telemetry)

**Wiring:**
```
Battery (+/-) → PDB → 4x ESCs
              ↓
         5V → Raspberry Pi
         12V → Camera/VTX
```

---

### 7. Sensors & Peripherals

#### GPS Module (Optional but Recommended)

**NEO-M8N GPS:**
- 10Hz update rate
- Position accuracy: 2.5m
- Altitude accuracy: 3m
- UART connection to Raspberry Pi
- Magnetic compass included

#### Camera (for FPV)

**Raspberry Pi Camera V2:**
- 8MP sensor
- 1080p @ 30fps
- CSI ribbon cable connection
- Wide angle lens option
- Price: $25-45

**Alternative: USB Webcam**
- 720p/1080p resolution
- USB connection
- Lower latency for some models
- Price: $20-50

---

## 🔌 Wiring Diagrams

### Basic Quadcopter Wiring

```
                    ┌─────────────────┐
                    │  Raspberry Pi 4 │
                    │                 │
                    │  GPIO Pins:     │
                    │  17,27,22,23    │
                    └────┬─┬─┬─┬──────┘
                         │ │ │ │
         ┌───────────────┘ │ │ └───────────────┐
         │       ┌─────────┘ └─────────┐       │
         │       │                     │       │
         ▼       ▼                     ▼       ▼
      ┌───┐   ┌───┐                 ┌───┐   ┌───┐
      │ESC│   │ESC│                 │ESC│   │ESC│
      │30A│   │30A│                 │30A│   │30A│
      └─┬─┘   └─┬─┘                 └─┬─┘   └─┬─┘
        │       │                     │       │
        ▼       ▼                     ▼       ▼
      [M_FL]  [M_FR]              [M_RL]  [M_RR]
       ↻       ↺                    ↺       ↻

Power Distribution:
      ┌──────────┐
      │  Battery │ 11.1V 3S LiPo
      │  2200mAh │
      └─────┬────┘
            │
            ▼
      ┌─────────┐
      │   PDB   │ Power Distribution Board
      ├─────────┤
      │ 5V→ RPi │ 5V/3A for Raspberry Pi
      │ 12V→Cam │ 12V for Camera/VTX
      │ Bat→ESC │ Battery voltage to ESCs
      └─────────┘

Legend:
  M_FL = Motor Front Left (CCW)
  M_FR = Motor Front Right (CW)
  M_RL = Motor Rear Left (CW)
  M_RR = Motor Rear Right (CCW)
  ESC = Electronic Speed Controller
  RPi = Raspberry Pi
  PDB = Power Distribution Board
```

---

### Raspberry Pi GPIO Pinout

```
Raspberry Pi 4 GPIO (BCM numbering):

    3.3V  (1) (2)  5V      ← Connect 5V from PDB
   GPIO2  (3) (4)  5V
   GPIO3  (5) (6)  GND     ← Ground to PDB
   GPIO4  (7) (8)  GPIO14
     GND  (9) (10) GPIO15
  GPIO17 (11) (12) GPIO18  ← Motor Control Pins
  GPIO27 (13) (14) GND     ← (17, 27, 22, 23)
  GPIO22 (15) (16) GPIO23
    3.3V (17) (18) GPIO24
  GPIO10 (19) (20) GND
   GPIO9 (21) (22) GPIO25
  GPIO11 (23) (24) GPIO8
     GND (25) (26) GPIO7
   ...

Motor Connections (default in drone_client.py):
  GPIO 17 → ESC 1 (Front Left)
  GPIO 27 → ESC 2 (Front Right)
  GPIO 22 → ESC 3 (Rear Left)
  GPIO 23 → ESC 4 (Rear Right)
```

---

### ESC to Motor Wiring

```
ESC (Electronic Speed Controller):

Power In:  Red Wire  (+) ───────→ PDB +
           Black Wire (-) ───────→ PDB -

Signal In: Yellow/White ────────→ Raspberry Pi GPIO
           Brown/Black ─────────→ Ground

Motor Out: 3 Wires (any order initially)
           Wire A ──┐
           Wire B ──┼───→ Motor (3 phase)
           Wire C ──┘

Note: Swap any 2 motor wires to reverse direction
```

---

## 🛒 Shopping List

### Budget Build (~$400)

**Core Components:**
- [ ] Raspberry Pi 4 (4GB) - $55
- [ ] 32GB microSD + adapter - $12
- [ ] 450mm frame kit - $35
- [ ] 4x 2212 920KV motors - $50
- [ ] 4x 30A ESC - $50
- [ ] Power distribution board - $15
- [ ] 10x4.5" props (2 sets) - $15
- [ ] 11.1V 2200mAh LiPo (2x) - $50
- [ ] LiPo charger - $30
- [ ] Cables & connectors kit - $20
- [ ] Heat shrink & solder - $10
- [ ] Basic tools (if needed) - $30

**Optional but Recommended:**
- [ ] Raspberry Pi Camera V2 - $35
- [ ] GPS module (NEO-M8N) - $20
- [ ] RC transmitter (safety) - $60
- [ ] Propeller guards - $15
- [ ] Extra propellers - $10

**Total: ~$400-500**

---

### Premium Build (~$800)

All budget items PLUS:
- [ ] Carbon fiber frame - $80 (vs $35)
- [ ] Higher quality motors - $100 (vs $50)
- [ ] 4-in-1 ESC - $80 (vs $50)
- [ ] Flight controller (Pixhawk) - $120
- [ ] FPV camera + VTX - $60
- [ ] Telemetry radio - $50
- [ ] Better LiPo batteries (4S) - $80
- [ ] Digital multimeter - $30
- [ ] Soldering station - $50
- [ ] LiPo storage bag - $15

**Total: ~$800-900**

---

## 🔧 Assembly Instructions

### Step 1: Frame Assembly (1-2 hours)

1. **Prepare frame parts:**
   - Top plate, bottom plate, 4x arms
   - Landing gear, standoffs, screws

2. **Attach arms to bottom plate:**
   - Use M3 screws and Loctite
   - Ensure symmetric spacing
   - Front arms at 45° angle

3. **Mount motors to arms:**
   - 4x M3 screws per motor
   - Check rotation direction
   - Secure wiring with zip ties

4. **Install top plate:**
   - Leave space for electronics
   - Use standoffs for height
   - Ensure access to components

---

### Step 2: Electronics Installation (2-3 hours)

1. **Mount Power Distribution Board:**
   - Center of frame (bottom)
   - Use double-sided foam tape
   - Ensure XT60 connector accessible

2. **Install Raspberry Pi:**
   - Top plate mounting
   - Heat sinks applied
   - GPIO pins accessible
   - Camera ribbon cable access

3. **Connect ESCs to PDB:**
   - Solder red wire to + pad
   - Solder black wire to - pad
   - Heat shrink connections
   - Route wires through arms

4. **Connect ESCs to Motors:**
   - Solder 3 phase wires
   - Initial order (change later if needed)
   - Heat shrink all connections

5. **Connect Signal Wires:**
   - ESC signal → Raspberry Pi GPIO
   - 5V from PDB → Raspberry Pi 5V pin
   - Ground → Raspberry Pi ground
   - Use servo extension cables

---

### Step 3: Software Setup (1-2 hours)

1. **Prepare Raspberry Pi:**
   ```bash
   # Install Raspberry Pi OS (Lite)
   # Enable SSH and WiFi
   sudo raspi-config
   ```

2. **Install Python dependencies:**
   ```bash
   sudo apt-get update
   sudo apt-get install python3-pip
   pip3 install RPi.GPIO python-socketio
   ```

3. **Copy drone client:**
   ```bash
   scp -r drone-client/ pi@raspberrypi.local:~/
   ```

4. **Test GPIO (motors off!):**
   ```bash
   cd drone-client
   python3 drone_client.py --simulator
   ```

---

### Step 4: Initial Testing (2-3 hours)

⚠️ **SAFETY FIRST - REMOVE PROPELLERS!**

1. **Power-on test:**
   - Connect battery (no props)
   - Check for smoke/heat
   - Verify Raspberry Pi boots
   - Check LED indicators

2. **Motor direction test:**
   - Start drone client
   - Send low throttle command
   - Each motor should spin correctly:
     - Front Left: Counter-clockwise (CCW)
     - Front Right: Clockwise (CW)
     - Rear Left: Clockwise (CW)
     - Rear Right: Counter-clockwise (CCW)
   - Swap motor wires if wrong direction

3. **Control response test:**
   - Test each joystick axis
   - Verify motor speed changes
   - Check emergency stop works
   - Test connection loss behavior

4. **Balance test:**
   - Install propellers (carefully!)
   - Secure drone (zip ties to table)
   - Apply low throttle (20-30%)
   - Check for vibrations
   - Verify balanced thrust

---

### Step 5: Flight Testing (Outside only!)

⚠️ **CRITICAL SAFETY:**
- Open area only (no people/property nearby)
- Remove obstacles (trees, wires, etc.)
- Check weather (no wind/rain)
- Have emergency stop ready
- Start with 5-second hover tests
- Gradually increase duration

1. **Ground hover test:**
   - Apply slow throttle
   - Lift 10cm off ground
   - Hold for 5 seconds
   - Land gently
   - Repeat 5-10 times

2. **Low altitude test:**
   - Hover at 1-2 meters
   - Test yaw (rotation)
   - Test pitch (forward/back)
   - Test roll (left/right)
   - Land between tests

3. **Full flight test:**
   - Increase altitude gradually
   - Test all control axes
   - Monitor battery level
   - Land at 30% battery
   - Log any issues

---

## 🛠️ Tools Required

### Essential Tools:

- [ ] **Soldering iron** (60W minimum)
- [ ] **Solder** (60/40 rosin core)
- [ ] **Wire cutters**
- [ ] **Wire strippers**
- [ ] **Hex key set** (1.5mm, 2mm, 2.5mm)
- [ ] **Screwdriver set** (Phillips, flat)
- [ ] **Hot glue gun**
- [ ] **Heat shrink tubing** (various sizes)
- [ ] **Heat gun** or lighter
- [ ] **Zip ties** (various sizes)
- [ ] **Double-sided tape**
- [ ] **Multimeter** (voltage testing)

### Nice to Have:

- [ ] Helping hands/PCB holder
- [ ] Digital caliper
- [ ] Propeller balancer
- [ ] LiPo voltage checker
- [ ] Cable tester
- [ ] Label maker

---

## ⚠️ Safety Guidelines

### Electrical Safety:

1. **Never connect battery with wrong polarity**
2. **Always use fuse or current limiter**
3. **Check for shorts before first power-on**
4. **Never exceed ESC current rating**
5. **Use proper gauge wire (18-20 AWG)**

### Battery Safety:

1. **Never puncture or crush LiPo**
2. **Store at 3.8V per cell (storage voltage)**
3. **Charge in fireproof bag**
4. **Never leave charging unattended**
5. **Dispose of damaged batteries properly**

### Flight Safety:

1. **Remove props for all bench testing**
2. **Never fly near people or property**
3. **Check propellers before each flight**
4. **Monitor battery voltage constantly**
5. **Land immediately if any issues**
6. **Follow local drone regulations**
7. **Maintain line-of-sight**
8. **Have manual override (RC transmitter)**

---

## 📞 Troubleshooting Hardware

### Motors won't spin:
- Check ESC connections
- Verify battery voltage
- Test GPIO output with multimeter
- Check motor direction settings

### Drone unstable/crashes:
- Balance propellers
- Check motor directions (CW/CCW)
- Verify frame is rigid
- Adjust PID tuning (if using flight controller)

### Short flight time:
- Check battery capacity
- Verify motor efficiency
- Reduce weight
- Check for damaged propellers

### WiFi connection issues:
- Use 2.4GHz (better range)
- Check antenna orientation
- Reduce interference sources
- Consider WiFi booster

---

## 🎓 Learning Resources

### Hardware:
- [RCGroups Forums](https://www.rcgroups.com)
- [Oscar Liang's Blog](https://oscarliang.com)
- [Painless360 YouTube](https://www.youtube.com/c/Painless360)

### Raspberry Pi:
- [Official Raspberry Pi Documentation](https://www.raspberrypi.org/documentation/)
- [Raspberry Pi GPIO Tutorial](https://www.raspberrypi.org/documentation/usage/gpio/)

### Safety:
- [FAA Drone Rules (US)](https://www.faa.gov/uas)
- [LiPo Battery Safety Guide](https://rogershobbycenter.com/lipoguide)

---

## 📦 Recommended Vendors

### Electronics:
- **Adafruit** - Raspberry Pi & accessories
- **SparkFun** - Sensors and modules
- **Amazon** - General components

### Drone Parts:
- **GetFPV** - Racing/FPV components
- **HobbyKing** - Budget-friendly parts
- **Banggood** - International shipping

### Batteries:
- **HobbyKing** - LiPo batteries
- **GensAce** - High-quality batteries
- **Amazon** - General availability

---

**Remember: Start with simulator mode, then bench testing (no props), then tethered tests, then free flight!**

**Safety first, always! 🚁**
