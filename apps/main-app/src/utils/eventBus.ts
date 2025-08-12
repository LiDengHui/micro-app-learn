// ==================== EventBus 工具类 ====================

type EventCallback = (...args: any[]) => void;

interface EventMap {
  [eventName: string]: EventCallback[];
}

class EventBus {
  private events: EventMap = {};

  /**
   * 监听事件
   * @param eventName 事件名称
   * @param callback 回调函数
   */
  on(eventName: string, callback: EventCallback): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
    console.log(`EventBus: 已监听事件 ${eventName}`);
  }

  /**
   * 移除事件监听
   * @param eventName 事件名称
   * @param callback 回调函数（可选，如果不传则移除所有该事件的监听器）
   */
  off(eventName: string, callback?: EventCallback): void {
    if (!this.events[eventName]) {
      return;
    }

    if (callback) {
      const index = this.events[eventName].indexOf(callback);
      if (index > -1) {
        this.events[eventName].splice(index, 1);
        console.log(`EventBus: 已移除事件 ${eventName} 的指定监听器`);
      }
    } else {
      delete this.events[eventName];
      console.log(`EventBus: 已移除事件 ${eventName} 的所有监听器`);
    }
  }

  /**
   * 触发事件
   * @param eventName 事件名称
   * @param args 参数
   */
  emit(eventName: string, ...args: any[]): void {
    if (!this.events[eventName]) {
      console.log(`EventBus: 事件 ${eventName} 没有监听器`);
      return;
    }

    console.log(`EventBus: 触发事件 ${eventName}`, args);
    this.events[eventName].forEach((callback) => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`EventBus: 事件 ${eventName} 回调执行失败`, error);
      }
    });
  }

  /**
   * 获取指定事件的监听器数量
   * @param eventName 事件名称
   */
  getListenerCount(eventName: string): number {
    return this.events[eventName] ? this.events[eventName].length : 0;
  }

  /**
   * 清除所有事件监听器
   */
  clear(): void {
    this.events = {};
    console.log("EventBus: 已清除所有事件监听器");
  }
}

// 创建全局单例
const eventBus = new EventBus();

export default eventBus;
